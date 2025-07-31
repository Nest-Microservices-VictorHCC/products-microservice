import { BadRequestException, HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from 'generated/prisma';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect()
      .then(() => this.logger.log('Connected to the database'))
      .catch((error) => console.error('Database connection error:', error));
  }
  
  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const totalPages = await this.product.count({ where: { available: true } }); // Count only available products
    const lastPage = Math.ceil(totalPages / limit);

    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { available: true }, // Ensure we only fetch available products
      }),
      meta: {
        total: totalPages,
        page,
        lastPage
      }
    }
  }

  async findOne(id: number) {
    const product = await this.product.findUnique({
      where: { id, available: true } // Ensure we only fetch available products
    });

    if(!product) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Product with id #${id} not found`
      });
    }

    return product
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    const { id: __, ...data } = updateProductDto; // Destructure to remove id from the data
    
    if(!data || Object.keys(data).length === 0) {
      throw new BadRequestException('No data provided to update the product');
    }

    await this.findOne(id); // Ensure the product exists before updating
    
    return this.product.update({
      where: { id },
      data
    });
  }

  async remove(id: number) {
    // return this.product.delete({
    //   where: { id }
    // }).catch((error) => {
    //   this.logger.error(`Error deleting product with id #${id}`, error);
    //   throw new NotFoundException(`Product with id #${id} not found`);
    // }); // this way its similar to the findOne method but only makes one query to the database

    await this.findOne(id); // Ensure the product exists before "deleting"

    const product = await this.product.update({
      where: { id },
      data: { available: false } // Soft delete
    });

    return product;
  }

  async validateProducts(ids: number[]) {
    ids = Array.from(new Set(ids)); // Remove duplicates

    const products = await this.product.findMany({
      where: {
        id: {
          in: ids
        }
      }
    })

    if(products.length !== ids.length) {
      throw new RpcException({
        message: 'Some products do not exist',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return products;
  }
}
